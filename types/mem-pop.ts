/**
 * 짤기억 (Mem-Pop) 핵심 데이터 타입 정의
 * PRD 4.2, 4.3, 5.1 ~ 5.6 규격 준수
 */

export interface QuizData {
  question: string;
  options: [string, string, string]; // 3지선다 보기
  answer_index: 0 | 1 | 2; // 정답 인덱스 (0, 1, 2)
  explanation: string; // 한 줄 정답 해설
}

export interface MemPopContent {
  keyword: string;
  summary: string; // 1~2줄 핵심 배경 및 개념 설명
  background?: string; // 하위 호환용
  story: [string, string, string]; // 3줄 연상 암기 스토리 [상황 연결, 말장난/연상, 펀치라인]
  quiz: QuizData;
}

export type ErrorType =
  | 'EMPTY_INPUT'
  | 'MULTIPLE_INPUT'
  | 'INVALID_INPUT'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'PARSE_ERROR'
  | 'SERVER_ERROR';

export interface GenerateRequest {
  keyword: string;
}

export interface GenerateSuccessResponse {
  success: true;
  data: MemPopContent;
}

export interface GenerateErrorResponse {
  success: false;
  error: ErrorType;
  message: string;
}

export type GenerateResponse = GenerateSuccessResponse | GenerateErrorResponse;
