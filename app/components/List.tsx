type ListParams = {
  description: string;
};
function List(props: ListParams){
  return (
    <div>list of details: {props.description}</div>
  )
}
export default List;