import Card from "./Card";
import List from "./List";

function Desc() {
  return (
    <Card hook="props" title="Description">
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        <List description="This is a sample description" />
      </ul>
    </Card>
  );
}

export default Desc;
