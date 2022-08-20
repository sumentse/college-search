import { useQuery } from "@tanstack/react-query";
import CollegeScoreCardService from "services/CollegeScoreCard";

const fetchSchools = (params) => async () => {
  const schools = await CollegeScoreCardService.get(params);
  if (schools?.data?.results?.length > 0) {
    return {
      metadata: schools.metadata,
      results: schools.data.results.map((school) => {
        const {
          id,
          "school.name": name,
          "location.lat": lat,
          "location.lon": lng,
        } = school;
        return {
          id,
          name,
          lat,
          lng,
        };
      }),
    };
  }
  return schools.data;
};

const useQuerySchools = (params) => {
  return useQuery({
    queryKey: ["schools", params],
    queryFn: fetchSchools(params),
    retry: 1,
    enabled: Boolean(params["school.name"]),
  });
};

export default useQuerySchools;
