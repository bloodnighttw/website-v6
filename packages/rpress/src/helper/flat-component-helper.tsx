export class FlatComponentHelper {
  private components: React.ComponentType<any>[];
  private props: Record<string, any>[];

  constructor() {
    this.components = [];
    this.props = [];
  }

  public expand<
    T extends { children: React.ReactNode } = { children: React.ReactNode },
    C extends React.ComponentType<T> = React.ComponentType<T>,
  >(child: C, props: Omit<React.ComponentProps<C>, "children">) {
    this.components.unshift(child);
    this.props.unshift((props as Record<string, any>) ?? {});
  }

  public flatten() {
    return (props: { children: React.ReactNode }) =>
      this.components.reduce((acc, Component, index) => {
        return <Component {...this.props[index]}>{acc}</Component>;
      }, props.children);
  }
}
