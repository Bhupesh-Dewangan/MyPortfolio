import { Timeline } from "../components/Timeline";
import { education } from "../constants";
const Education = () => {
  return (
    <div className="w-full" id="education">
      <Timeline data={education} />
    </div>
  );
};

export default Education;
