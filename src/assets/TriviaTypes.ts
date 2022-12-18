import { ActionRowBuilder, EmbedBuilder } from "discord.js";


export type TriviaDifficulty = {
  readonly name: string;
  readonly allotted_time: number;
  readonly reward: number;
};

export type TriviaQuestion = {
  category: TriviaCategory;
  difficulty: TriviaDifficulty;
  text: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type TriviaCategory = {
  readonly name: string;
  readonly id: number;
  readonly color: number;
};

type RawTriviaQuestion = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};


export type TriviaResponse = {
  response_code: number;
  results: RawTriviaQuestion[];
};

export type TriviaData = {
  question: TriviaQuestion;
  timeout?: NodeJS.Timeout;
  embed: EmbedBuilder;
  row: ActionRowBuilder;
};