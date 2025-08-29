export class FlatComponentHelper {
  private components: React.ComponentType<any>[];
  private props: Record<string, any>[];

  constructor() {
    this.components = [];
    this.props = [];
  }

  public expand<
    T extends { children: React.ReactNode } = { children: React.ReactNode },
    // @ts-ignore
  >(child: React.ComponentType<T>, props: Omit<T, "children">) {
    
    this.components.unshift(child);
    this.props.unshift((props as Record<string, any>) ?? {});
  }

  public flatten() {
    // console.log("helper:", this.components);
    return (props: { children: React.ReactNode }) =>
      this.components.reduce((acc, Component, index) => {
        return <Component {...this.props[index]}>{acc}</Component>;
      }, props.children);
  }
}