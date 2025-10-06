import Card from "@/components/card";
import CardLabel from "@/components/card/label";

function Project() {
  return (
    <>
      <div className="flex justify-center">
        <CardLabel>My Projects</CardLabel>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-8">
        <Card>hello</Card>
        <Card>hello</Card>
        <Card>hello</Card>
      </div>
    </>
  );
}

export default Project;
