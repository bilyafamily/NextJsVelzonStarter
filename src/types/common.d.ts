export interface ResponseDto<T = any> {
  statusCode: number;
  result: T;
  isSuccess: boolean;
  message: string;
}
