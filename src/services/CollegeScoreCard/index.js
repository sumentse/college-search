import { get } from "./base";

const CollegeScoreCard = {
  get: params => {
      return get(`/v1/schools`, {
        params,
      });
  },
};

export default CollegeScoreCard;
