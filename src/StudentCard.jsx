import { useState } from "react";

function StudentCard({ name, id, course, year }) {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
  setLikes(likes + 1);
};

  return (
    <div className="student-card">
      <h2>{name}</h2>

      <p>ID: {id}</p>
      <p>Course: {course}</p>
      <p>Year Level: {year}</p>

      <button onClick={handleLike}>
  ❤️ Like: {likes}
</button>
    </div>
  );
}

export default StudentCard;