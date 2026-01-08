import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// 1. Load the Proto
// In Docker, this maps to /app/protos/payment.proto
const PROTO_PATH = path.join(process.cwd(), 'protos/payment.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const paymentProto = grpc.loadPackageDefinition(packageDefinition) as any;

// 2. Create the Client Instance
// We connect to 'payment_service:50051' (defined in docker-compose)
const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'localhost:50051';

const client = new paymentProto.payment.PaymentService(
  paymentServiceUrl,
  grpc.credentials.createInsecure()
);

export const processPayment = (userId: number, amount: number) => {
    return new Promise((resolve, reject) => {
        const request = {
            userId: userId.toString(),
            amount: amount,
            currency: "USD",
            cardLast4: "4242"
        };
        client.ProcessPayment(request, (error: any, response: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};