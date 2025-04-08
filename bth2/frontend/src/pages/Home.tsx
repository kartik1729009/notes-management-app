import { Link } from "react-router-dom";

const Home = () => {
  const subject = ["PHYSICS", "CHEMISTRY", "MATH"];

  return (
    <div>
      {subject.map((subject, index) => (
        <div key={index}>
            <Link key = {index} to = "/chapter" state={{subjectName:subject}}>
          <h3>{subject}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
