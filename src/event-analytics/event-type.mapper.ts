/* eslint-disable prettier/prettier */
import { RequestStatus } from 'src/request/enums/request-status.enum';
import { EventType } from './enums/event-type.enum';

export const mapRequestStatusToEventType = (status: RequestStatus): EventType | null => {
  const map: Record<RequestStatus, EventType> = {
    [RequestStatus.PENDING]: EventType.REQUEST_SENT,
    [RequestStatus.ACCEPTED]: EventType.REQUEST_ACCEPTED,
    [RequestStatus.REJECTED]: EventType.REQUEST_REJECTED,
    [RequestStatus.CANCELLED]: EventType.REQUEST_CANCELLED,
    [RequestStatus.IN_TRANSIT]: EventType.REQUEST_IN_TRANSIT,
    [RequestStatus.COMPLETED]: EventType.REQUEST_COMPLETED,
    [RequestStatus.EXPIRED]: EventType.REQUEST_EXPIRED,
  };
  return map[status] ?? null;
};