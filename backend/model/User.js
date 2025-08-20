import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    createdWorkshops : {
        type: [Schema.Types.ObjectId],
        ref: 'Workshop'
    },
    purchasedWorkshops : {
        type: [Schema.Types.ObjectId],
        ref: 'Workshop'
    },
    transactions: {
        type: [Schema.Types.ObjectId],
        ref: 'Transaction'
    },
});

const User = model('User', UserSchema);
export default User;