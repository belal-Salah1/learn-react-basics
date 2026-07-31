type ListParams = {
  description: string;
};

function List(props: ListParams) {
  return (
    <li className="px-4 py-3 text-sm">
      <span className="text-muted">detail: </span>
      {props.description}
    </li>
  );
}

export default List;
