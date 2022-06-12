import { Children, ReactNode } from "react";

interface IListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
}

function List<T>({ items, renderItem }: IListProps<T>) {
  return <>{Children.toArray(items.map(renderItem))}</>;
}

export default List;
