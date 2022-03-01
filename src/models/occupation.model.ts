import mongoose from "mongoose";

export interface OccupationDocument extends mongoose.Document {
  name: string;
  num?: number;
  subgroup?: string;
  maingroup?: string;
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
  jobs?: {
    [occupation_name: string]: number;
  };
  skills?: {
    [skillname: string]: number;
  };
  traits?: {
    [traitName: string]: number;
  };
  geos?: {
    [geoName: string]: number;
  };
  employers?: {
    [employer: string]: number;
  };
}

const occupationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    num: { type: Number },
    subgroup: String,
    maingroup: String,
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
    ads_count: Number,
    eval_mape: Number,
    prediction_percentages: Object,
    prediction_values: Object,
    trend_percentages: Object,
    jobs: Object,
    skills: Object,
    geos: Object,
    traits: Object,
    employers: Object,
  },
  {
    timestamps: true,
  }
);

const OccupationModel = mongoose.model<OccupationDocument>(
  "Occupation",
  occupationSchema
);

export default OccupationModel;
