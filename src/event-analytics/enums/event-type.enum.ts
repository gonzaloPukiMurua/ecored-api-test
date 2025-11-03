/* eslint-disable prettier/prettier */
export enum EventType {
  USER_SIGNED_UP = 'UserSignedUp',
  PUBLICATION_CREATED = 'PublicationCreated',
  VIEW = 'View',
  SEARCH_PERFORMED = 'SearchPerformed',
  REQUEST_SENT = 'RequestSent',
  REQUEST_ACCEPTED = 'RequestAccepted',
  REQUEST_REJECTED = 'RequestRejected',
  REQUEST_CANCELLED = 'RequestCancelled',
  REQUEST_IN_TRANSIT = 'RequestInTransit',
  REQUEST_COMPLETED = 'RequestCompleted',
  REQUEST_EXPIRED = 'RequestExpired',
  CONTACT_CLICKED = 'ContactClicked',
  DELIVERY_CONFIRMED = 'DeliveryConfirmed',
  REPORT_SUBMITTED = 'ReportSubmitted',
}