import { ChatOllama } from "@langchain/ollama";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { BaseMessage, SystemMessage, HumanMessage } from "@langchain/core/messages";
import { tools } from "./tools.js";

const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
    }),
});

const model = new ChatOllama({
    model: "llama3.2",
    baseUrl: process.env.OLLAMA_BASE_URL || "http://host.docker.internal:11434",
    temperature: 0
});

const modelWithTools = model.bindTools(tools);

async function agentNode(state: typeof AgentState.State) {
    const { messages } = state;
    const result = await modelWithTools.invoke(messages);
    return { messages: [result] };
}

const toolNode = new ToolNode(tools);

function shouldContinue(state: typeof AgentState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];
    if (
        "tool_calls" in lastMessage && 
        Array.isArray(lastMessage.tool_calls) && 
        lastMessage.tool_calls.length > 0
    ) {
        return "tools";
    }
    return "__end__";
}

const workflow = new StateGraph(AgentState)
    .addNode("agent", agentNode)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue, {
        "tools": "tools",
        "__end__": "__end__",
    })
    .addEdge("tools", "agent");

export const agentExecutor = workflow.compile();