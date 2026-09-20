import React, { useState, useEffect } from "react";
import { Timeline } from "../components/Timeline";
import { education as defaultEducation } from "../constants";
import { API_BASE_URL } from "../config/api";

const Education = () => {
  const [educationData, setEducationData] = useState(defaultEducation);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/education`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEducationData(data);
          }
        }
      } catch (err) {
        console.warn("Could not fetch education records from backend API, using defaults.", err);
      }
    };

    fetchEducation();
  }, []);

  return (
    <div className="w-full" id="education">
      <Timeline data={educationData} />
    </div>
  );
};

export default Education;
