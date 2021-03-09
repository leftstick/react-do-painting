declare module '*.css'
declare module '*.less' {
  interface IStyleModules {
    [classname: string]: string
  }

  const styles: IStyleModules
  export default styles
}
