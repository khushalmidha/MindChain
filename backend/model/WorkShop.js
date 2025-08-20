import { Schema, model } from 'mongoose';

const WorkshopSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    },
    owner:{
        type: String,
        required: true
    }
})

const Workshop = model('Workshop', WorkshopSchema);
export default Workshop;