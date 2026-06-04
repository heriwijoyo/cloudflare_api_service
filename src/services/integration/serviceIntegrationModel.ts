export enum ExternalSystem {
    AMAZON_SES = 'AMAZON_SES',
    META_BUSINESS_CLOUD = 'META_BUSINESS_CLOUD',
    GOOGLE_WORKSPACE = 'GOOGLE_WORKSPACE',
    AMAZON_S3 = 'AMAZON_S3'
}

export enum ExternalRequestMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

export enum ExternalEndpoint {
    AMAZON_SES = 'https://email.REGION.amazonaws.com/v2/email/outbound-emails'
}

export interface ExternalRequest {
    system: ExternalSystem
    endpoint: ExternalEndpoint
    method: ExternalRequestMethod
    payload: any
}