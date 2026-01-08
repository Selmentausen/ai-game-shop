import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { start } from 'repl';

const PROTO_PATH = path.join(process.cwd(), 'protos/payment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const paymentProto = grpc.loadPackageDefinition(packageDefinition) as any;
const processPayment = (call: any, callback: any) => {
    const { userId, amount } = call.request;
    console.log(`[Payment Service] Proccessing $${amount} for User ${userId}...`);

    // MOCK

    setTimeout(() => {
        console.log("[Payment Service] Transaction Approved.")
        callback(null, {
            success: true,
            transactionId: "TXN_" + Math.random().toString(36).substring(7).toUpperCase(),
            errorMessage: ""
        });
    }, 1000);
}

const startServer = () => {
    const server = new grpc.Server();
    server.addService(paymentProto.payment.PaymentService.service, {
        ProcessPayment: processPayment
    });
    const PORT = "0.0.0.0:50051";
    server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Payment RPC Service running on ${PORT}`);
    });
};

startServer();