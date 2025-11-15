import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';

// Interface for a single turn in the quiz
interface IQuizTurn {
    question: string;
    answer: string;
}

// Interface for a single recommendation from the quiz
interface IQuizRecommendation {
    careerName: string;
    description: string;
    suitability: string;
    suggestedMajors: string[];
}

// Interface for the QuizResult document
export interface IQuizResult extends Document {
    userId: Types.ObjectId | IUser;
    history: IQuizTurn[];
    recommendations: IQuizRecommendation[];
    createdAt: Date;
}

const QuizTurnSchema: Schema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { _id: false });

const QuizRecommendationSchema: Schema = new Schema({
    careerName: { type: String, required: true },
    description: { type: String, required: true },
    suitability: { type: String, required: true },
    suggestedMajors: [{ type: String }],
}, { _id: false });

const QuizResultSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    history: [QuizTurnSchema],
    recommendations: [QuizRecommendationSchema],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
