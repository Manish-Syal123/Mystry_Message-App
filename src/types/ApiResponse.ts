import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}

// name?: type   => represents Optional fields,: can be there or cannot be there .
// name:type  => are required fields.
