import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function IndexPage() {
  return (
    <div className="justify-between">
      <Link to="/dashboard">
        <Button>Dashboard</Button>
      </Link>
      <ModeToggle />
    </div>
  );
}
