declare module '*.css'
declare module '*.less' {
  interface IStyleModules {
    [classname: string]: string
  }

  const styles: IStyleModules
  export default styles
}
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement
  const url: string
  export default url
}
