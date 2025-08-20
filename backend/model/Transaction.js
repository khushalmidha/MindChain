import { Schema,model } from "mongoose";

const TransactionSchema = new Schema({
    transactionHash: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        enum: ['workshop', 'token'],
        required: true
    },
    workshop: {
        type: Schema.Types.ObjectId,
        ref: 'Workshop',
    },
    token: {
        type: String
    },
    transactionType: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

TransactionSchema.index({ transactionHash: 1, transactionType: 1,type : 1 }, { unique: true });



const Transaction = model('Transaction', TransactionSchema);
export default Transaction;