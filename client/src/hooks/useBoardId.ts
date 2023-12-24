import { useParams } from "react-router-dom";

const useBoardId = () => {
  const { id = "" } = useParams<{ id: string }>();
  return id;
};

export { useBoardId };

export default useBoardId;
