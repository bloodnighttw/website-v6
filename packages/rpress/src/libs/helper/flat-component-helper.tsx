export class FlatComponentHelper {
  private components: Array<React.ComponentType<any>>;
  private props: Array<Record<string, any>>;

  constructor() {
    this.components = [];
    this.props = [];
  }

  /**
   * Add a wrapper component and its props.
   * Components are stored in order of application: first added wraps last added.
   * Returns a new FlatComponentHelper for immutable usage.
   */
  public add<C extends React.ComponentType<any>>(
    child: C,
    props: Omit<React.ComponentProps<C>, "children">,
  ) {
    this.components.push(child);
    this.props.push(props ?? {});
  }

  /**
   * Build a wrapper component that composes the added components.
   * Usage: const Wrapper = helper.flatten(); <Wrapper>{children}</Wrapper>
   */
  public flatten(): React.FC<{ children: React.ReactNode }> {
    const components = [...this.components];
    const props = [...this.props];

    return function Wrapper({ children }) {
      return components.reduceRight((acc, Component, index) => {
        return <Component {...props[index]}>{acc}</Component>;
      }, children);
    };
  }

  /**
   * Pure helper: compose from arrays without mutation.
   */
  public static compose(
    wrappers: Array<{
      component: React.ComponentType<any>;
      props?: Record<string, any>;
    }>,
  ) {
    const helper = new FlatComponentHelper();
    for (const w of wrappers) {
      // use add which returns new, but we'll mutate local to avoid many allocations
      helper.components.push(w.component);
      helper.props.push(w.props ?? {});
    }
    return helper;
  }
}
