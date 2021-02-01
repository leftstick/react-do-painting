export enum IDrawMode {
  DRAW,
  SELECT,
}

export interface IPoint {
  x: number
  y: number
}

export type IShapeType = 'line' | 'text' | 'rect' | 'circle'

export interface IShape {
  id: string
  type: IShapeType
  lineColor: Color | string
  lineWidth: number
}

export interface ILine extends IShape {
  points: IPoint[]
}

export interface IRect extends IShape {
  x: number
  y: number
  width: number
  height: number
}

export interface IDrawingTool {
  type: IShapeType
  drawWidth: number
  drawColor: string
}

export type IToolType = 'undo' | 'redo' | 'select' | 'delete' | 'eraser' | 'save' | IShapeType

export enum Color {
  WHITE = '#fff',
  RED = '#f55a6c',
  YELLOW = '#f7c825',
  GREEN = '#63d320',
  BLUENESS = '#4fe2c2',
  BLUE = '#59b9fe',
  PURPLE = '#bd0fe0',
  BLACK = '#000',
}

export interface IAppContext {
  drawing: boolean
  setDrawing: React.Dispatch<React.SetStateAction<boolean>>
  drawMode: IDrawMode
  setDrawMode: React.Dispatch<React.SetStateAction<IDrawMode>>
  workingDrawTool: IDrawingTool
  setWorkingDrawTool: React.Dispatch<React.SetStateAction<IDrawingTool | null>>
  shapes: IShape[]
  addShape: (shape: IShape) => void
  updateShape: (id: string, shape: IShape) => void
  removeShape: (shape: IShape) => void
  redoShapes: IShape[]
  addToRedoShapes: (shape: IShape) => void
  removeFromRedoShapes: (shape: IShape) => void
  selectedShape: IShape
  setSelectedShape: React.Dispatch<React.SetStateAction<IShape>>
}
