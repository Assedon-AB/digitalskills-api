import mongoose from "mongoose";

export interface IndustryDocument extends mongoose.Document {
  num: number;
  ad_series?: {
    labels: string[];
    values: number[];
  };
  prediction_series?: {
    [predSpan: string]: {
      labels: string[];
      values: number[];
    };
  };
  model?: string;
  mape?: {
    value: number;
    type: string;
  }[];
  eval_mape?: number;
  prediction_values?: {
    [predSpan: string]: number;
  };
  prediction_percentages?: {
    [predSpan: string]: number;
  };
  trend_percentages?: {
    [trendSpan: string]: number;
  };
}

const industrySchema = new mongoose.Schema(
  {
    num: { type: Number, required: true },
    ad_series: {
      labels: [{ type: String }],
      values: [{ type: Number }],
    },
    prediction_series: Object,
    model: String,
    mape: [
      {
        type: Object,
      },
    ],
    eval_mape: Number,
    prediction_percentages: Object,
    prediction_values: Object,
    trend_percentages: Object,
  },
  {
    timestamps: true,
  }
);

const IndustryModel = mongoose.model<IndustryDocument>(
  "Industry",
  industrySchema
);

export default IndustryModel;
