// ─────────────────────────────────────────────
// Zenith PDF — Complete Error Taxonomy
// ─────────────────────────────────────────────
// Every user-facing error in the platform maps to
// a unique code, a human-friendly message, and a
// suggested resolution. API consumers receive the
// code + message; the web UI shows message + hint.
// ─────────────────────────────────────────────

export interface ZenithError {
  code: string;
  message: string;
  hint: string;
  httpStatus: number;
}

// ─── UPLOAD Errors (1xxx) ───

export const UPLOAD_ERRORS = {
  UPLOAD_NO_FILE: {
    code: "UPLOAD_NO_FILE",
    message: "No file was provided.",
    hint: "Please select at least one file to upload.",
    httpStatus: 400,
  },
  UPLOAD_TOO_MANY_FILES: {
    code: "UPLOAD_TOO_MANY_FILES",
    message: "Too many files uploaded.",
    hint: "Your current plan allows up to {maxFiles} files per job. Remove some files or upgrade your plan.",
    httpStatus: 400,
  },
  UPLOAD_FILE_TOO_LARGE: {
    code: "UPLOAD_FILE_TOO_LARGE",
    message: "File exceeds the maximum allowed size.",
    hint: "The file \"{fileName}\" is {fileSize}. Your plan allows up to {maxSize}. Compress the file or upgrade your plan.",
    httpStatus: 413,
  },
  UPLOAD_TOTAL_TOO_LARGE: {
    code: "UPLOAD_TOTAL_TOO_LARGE",
    message: "Total upload size exceeds the limit.",
    hint: "Combined upload is {totalSize}. The maximum is {maxTotal}. Remove some files or reduce file sizes.",
    httpStatus: 413,
  },
  UPLOAD_INVALID_TYPE: {
    code: "UPLOAD_INVALID_TYPE",
    message: "File type is not supported for this tool.",
    hint: "The file \"{fileName}\" is of type {fileType}. This tool accepts: {acceptedTypes}.",
    httpStatus: 415,
  },
  UPLOAD_CORRUPT_FILE: {
    code: "UPLOAD_CORRUPT_FILE",
    message: "The uploaded file appears to be corrupted or unreadable.",
    hint: "The file \"{fileName}\" could not be parsed. Try re-exporting it from the original application, or use our Repair PDF tool.",
    httpStatus: 422,
  },
  UPLOAD_EMPTY_FILE: {
    code: "UPLOAD_EMPTY_FILE",
    message: "The uploaded file is empty (0 bytes).",
    hint: "The file \"{fileName}\" contains no data. Please check the file and try again.",
    httpStatus: 422,
  },
  UPLOAD_TIMEOUT: {
    code: "UPLOAD_TIMEOUT",
    message: "File upload timed out.",
    hint: "The upload took too long to complete. Check your internet connection and try again with a smaller file.",
    httpStatus: 408,
  },
  UPLOAD_NETWORK_ERROR: {
    code: "UPLOAD_NETWORK_ERROR",
    message: "Upload failed due to a network error.",
    hint: "We couldn't receive your file. Please check your internet connection and try again.",
    httpStatus: 502,
  },
} as const;

// ─── PDF-specific Errors (2xxx) ───

export const PDF_ERRORS = {
  PDF_ENCRYPTED: {
    code: "PDF_ENCRYPTED",
    message: "This PDF is password-protected.",
    hint: "Please provide the password to process this file, or use the Unlock PDF tool first.",
    httpStatus: 422,
  },
  PDF_WRONG_PASSWORD: {
    code: "PDF_WRONG_PASSWORD",
    message: "Incorrect password for the encrypted PDF.",
    hint: "The password you entered does not unlock this PDF. Please double-check and try again.",
    httpStatus: 401,
  },
  PDF_MALFORMED: {
    code: "PDF_MALFORMED",
    message: "The PDF structure is malformed or damaged.",
    hint: "This PDF has structural issues that prevent processing. Try our Repair PDF tool to recover what's possible.",
    httpStatus: 422,
  },
  PDF_TOO_MANY_PAGES: {
    code: "PDF_TOO_MANY_PAGES",
    message: "The PDF exceeds the maximum page count for your plan.",
    hint: "This PDF has {pageCount} pages. Your plan allows up to {maxPages} pages per file. Upgrade your plan or split the PDF first.",
    httpStatus: 413,
  },
  PDF_UNSUPPORTED_VERSION: {
    code: "PDF_UNSUPPORTED_VERSION",
    message: "This PDF version is not supported.",
    hint: "The file uses PDF version {version}, which is not supported. Please re-save it as PDF 1.7 or earlier.",
    httpStatus: 422,
  },
  PDF_NO_PAGES: {
    code: "PDF_NO_PAGES",
    message: "The PDF contains no pages.",
    hint: "This PDF has 0 pages and cannot be processed. Please upload a valid PDF with at least one page.",
    httpStatus: 422,
  },
  PDF_INVALID_PAGE_RANGE: {
    code: "PDF_INVALID_PAGE_RANGE",
    message: "The specified page range is invalid.",
    hint: "Page range \"{range}\" is invalid. The PDF has {pageCount} pages. Use format like \"1-5\" or \"1,3,7-10\".",
    httpStatus: 400,
  },
  PDF_SIGNATURE_INVALIDATION: {
    code: "PDF_SIGNATURE_INVALIDATION",
    message: "This operation will invalidate existing digital signatures.",
    hint: "The PDF contains digital signatures that will be broken by this modification. Proceed only if you accept the signatures will be invalidated.",
    httpStatus: 409,
  },
  PDF_FONT_MISSING: {
    code: "PDF_FONT_MISSING",
    message: "Required fonts are missing or cannot be embedded.",
    hint: "The PDF references fonts that are not embedded and not available on our system. Text rendering may be affected.",
    httpStatus: 422,
  },
} as const;

// ─── PROCESSING Errors (3xxx) ───

export const PROCESS_ERRORS = {
  PROCESS_TIMEOUT: {
    code: "PROCESS_TIMEOUT",
    message: "Processing timed out.",
    hint: "The operation took longer than the {timeout} limit. Try with a smaller file or fewer pages. Large files may require a higher-tier plan.",
    httpStatus: 504,
  },
  PROCESS_OUT_OF_MEMORY: {
    code: "PROCESS_OUT_OF_MEMORY",
    message: "Processing ran out of memory.",
    hint: "This file is too complex for current resources. Try compressing the file first or processing fewer pages at a time.",
    httpStatus: 507,
  },
  PROCESS_INTERNAL_ERROR: {
    code: "PROCESS_INTERNAL_ERROR",
    message: "An unexpected error occurred during processing.",
    hint: "Something went wrong on our end. Our team has been notified. Please try again in a few minutes. If the issue persists, contact support with job ID: {jobId}.",
    httpStatus: 500,
  },
  PROCESS_UNSUPPORTED_OPERATION: {
    code: "PROCESS_UNSUPPORTED_OPERATION",
    message: "This operation is not supported for the given input.",
    hint: "The tool \"{toolName}\" cannot process this type of content. Check the tool's requirements and try a different approach.",
    httpStatus: 400,
  },
  PROCESS_PARTIAL_FAILURE: {
    code: "PROCESS_PARTIAL_FAILURE",
    message: "Processing completed with some errors.",
    hint: "{successCount} of {totalCount} items were processed successfully. Failed items: {failedItems}. You can download the partial result.",
    httpStatus: 207,
  },
  PROCESS_QUEUE_FULL: {
    code: "PROCESS_QUEUE_FULL",
    message: "The processing queue is full.",
    hint: "We're experiencing high demand. Your job has been queued and will start shortly. Estimated wait: {waitTime}.",
    httpStatus: 503,
  },
  PROCESS_CANCELLED: {
    code: "PROCESS_CANCELLED",
    message: "Processing was cancelled.",
    hint: "The job was cancelled before completion. No credits were charged. You can start a new job at any time.",
    httpStatus: 499,
  },
} as const;

// ─── RATE LIMIT & QUOTA Errors (4xxx) ───

export const LIMIT_ERRORS = {
  LIMIT_DAILY_JOBS: {
    code: "LIMIT_DAILY_JOBS",
    message: "Daily job limit reached.",
    hint: "You've used {used} of {limit} jobs today. Your limit resets at midnight UTC. Upgrade your plan for more jobs.",
    httpStatus: 429,
  },
  LIMIT_CREDITS_EXHAUSTED: {
    code: "LIMIT_CREDITS_EXHAUSTED",
    message: "Not enough credits remaining.",
    hint: "This operation requires {required} credits but you have {remaining}. Purchase more credits or wait for your monthly reset.",
    httpStatus: 402,
  },
  LIMIT_CONCURRENT_JOBS: {
    code: "LIMIT_CONCURRENT_JOBS",
    message: "Maximum concurrent jobs reached.",
    hint: "You have {active} active jobs. Your plan allows {limit} parallel jobs. Wait for a job to complete or upgrade your plan.",
    httpStatus: 429,
  },
  LIMIT_OCR_QUOTA: {
    code: "LIMIT_OCR_QUOTA",
    message: "Monthly OCR page quota exhausted.",
    hint: "You've used {used} of {limit} OCR pages this month. Resets on {resetDate}. Upgrade for more OCR capacity.",
    httpStatus: 402,
  },
  LIMIT_AI_CREDITS: {
    code: "LIMIT_AI_CREDITS",
    message: "AI credit balance depleted.",
    hint: "You've used all {limit} AI credits for this period. Resets on {resetDate}. Upgrade to Pro + AI for more credits.",
    httpStatus: 402,
  },
  LIMIT_ESIGN_ENVELOPES: {
    code: "LIMIT_ESIGN_ENVELOPES",
    message: "Monthly signature envelope quota reached.",
    hint: "You've sent {used} of {limit} envelopes this month. Resets on {resetDate}. Add the E-sign add-on for more envelopes.",
    httpStatus: 402,
  },
  LIMIT_RATE_THROTTLE: {
    code: "LIMIT_RATE_THROTTLE",
    message: "Too many requests. Please slow down.",
    hint: "You're making requests too quickly. Please wait {retryAfter} seconds before trying again.",
    httpStatus: 429,
  },
  LIMIT_BATCH_SIZE: {
    code: "LIMIT_BATCH_SIZE",
    message: "Batch size exceeds your plan limit.",
    hint: "You uploaded {count} files but your plan allows {limit} files per batch. Remove files or upgrade your plan.",
    httpStatus: 400,
  },
} as const;

// ─── AUTH Errors (5xxx) ───

export const AUTH_ERRORS = {
  AUTH_NOT_AUTHENTICATED: {
    code: "AUTH_NOT_AUTHENTICATED",
    message: "Authentication required.",
    hint: "Please sign in to access this feature. Create a free account to get started.",
    httpStatus: 401,
  },
  AUTH_SESSION_EXPIRED: {
    code: "AUTH_SESSION_EXPIRED",
    message: "Your session has expired.",
    hint: "Please sign in again to continue. Your in-progress work has been saved.",
    httpStatus: 401,
  },
  AUTH_INSUFFICIENT_TIER: {
    code: "AUTH_INSUFFICIENT_TIER",
    message: "This feature requires a higher plan.",
    hint: "The \"{feature}\" tool requires a {requiredTier} plan. You're currently on {currentTier}. Upgrade to unlock this feature.",
    httpStatus: 403,
  },
  AUTH_API_KEY_INVALID: {
    code: "AUTH_API_KEY_INVALID",
    message: "Invalid API key.",
    hint: "The provided API key is not valid. Check your key in the dashboard or generate a new one.",
    httpStatus: 401,
  },
  AUTH_API_KEY_REVOKED: {
    code: "AUTH_API_KEY_REVOKED",
    message: "This API key has been revoked.",
    hint: "The API key was revoked on {revokedDate}. Generate a new key from your dashboard.",
    httpStatus: 401,
  },
  AUTH_TEAM_PERMISSION: {
    code: "AUTH_TEAM_PERMISSION",
    message: "You don't have permission for this action.",
    hint: "Your team role ({role}) doesn't allow \"{action}\". Contact your team admin to update your permissions.",
    httpStatus: 403,
  },
} as const;

// ─── DOWNLOAD Errors (6xxx) ───

export const DOWNLOAD_ERRORS = {
  DOWNLOAD_EXPIRED: {
    code: "DOWNLOAD_EXPIRED",
    message: "This download link has expired.",
    hint: "Files are available for {retention} after processing. Re-upload and process the file to get a new download link.",
    httpStatus: 410,
  },
  DOWNLOAD_NOT_FOUND: {
    code: "DOWNLOAD_NOT_FOUND",
    message: "The requested file was not found.",
    hint: "This file may have been deleted or the link is invalid. Check the job ID and try again.",
    httpStatus: 404,
  },
  DOWNLOAD_NOT_READY: {
    code: "DOWNLOAD_NOT_READY",
    message: "The file is still being processed.",
    hint: "Processing is {progress}% complete. The download will be available once processing finishes.",
    httpStatus: 202,
  },
  DOWNLOAD_GENERATION_FAILED: {
    code: "DOWNLOAD_GENERATION_FAILED",
    message: "Failed to generate the output file.",
    hint: "The file was processed but output generation failed. Please try the operation again. Contact support if this persists.",
    httpStatus: 500,
  },
} as const;

// ─── TOOL-SPECIFIC Errors (7xxx) ───

export const TOOL_ERRORS = {
  // Merge
  MERGE_MIN_FILES: {
    code: "MERGE_MIN_FILES",
    message: "At least 2 files are required to merge.",
    hint: "Upload at least 2 PDF files to combine them. You currently have {count} file(s).",
    httpStatus: 400,
  },
  MERGE_INCOMPATIBLE_ENCRYPTION: {
    code: "MERGE_INCOMPATIBLE_ENCRYPTION",
    message: "Cannot merge PDFs with different encryption settings.",
    hint: "Some files are encrypted with different passwords. Unlock all PDFs first, then merge.",
    httpStatus: 422,
  },
  // Split
  SPLIT_SINGLE_PAGE: {
    code: "SPLIT_SINGLE_PAGE",
    message: "Cannot split a single-page PDF.",
    hint: "This PDF only has 1 page and cannot be split further.",
    httpStatus: 400,
  },
  SPLIT_INVALID_RANGE: {
    code: "SPLIT_INVALID_RANGE",
    message: "Invalid split range specified.",
    hint: "Range \"{range}\" is out of bounds. The PDF has {pageCount} pages. Use values between 1 and {pageCount}.",
    httpStatus: 400,
  },
  // Compress
  COMPRESS_ALREADY_OPTIMIZED: {
    code: "COMPRESS_ALREADY_OPTIMIZED",
    message: "This PDF is already well-optimized.",
    hint: "Compression achieved less than 1% size reduction. The file is already close to optimal size.",
    httpStatus: 200,
  },
  COMPRESS_STRONG_PRO_ONLY: {
    code: "COMPRESS_STRONG_PRO_ONLY",
    message: "Strong compression requires a Pro plan.",
    hint: "Basic compression is available on your current plan. Upgrade to Pro for maximum compression.",
    httpStatus: 403,
  },
  // Watermark
  WATERMARK_TEXT_TOO_LONG: {
    code: "WATERMARK_TEXT_TOO_LONG",
    message: "Watermark text is too long.",
    hint: "Maximum watermark text length is {maxLength} characters. Your text is {length} characters.",
    httpStatus: 400,
  },
  // Page Numbers
  PAGE_NUMBERS_INVALID_START: {
    code: "PAGE_NUMBERS_INVALID_START",
    message: "Invalid starting page number.",
    hint: "Starting number must be a positive integer. You provided \"{value}\".",
    httpStatus: 400,
  },
  // Protect
  PROTECT_WEAK_PASSWORD: {
    code: "PROTECT_WEAK_PASSWORD",
    message: "Password is too weak.",
    hint: "Passwords must be at least 4 characters. For better security, use 8+ characters with mixed case, numbers, and symbols.",
    httpStatus: 400,
  },
  // OCR
  OCR_LANGUAGE_UNSUPPORTED: {
    code: "OCR_LANGUAGE_UNSUPPORTED",
    message: "The selected OCR language is not supported.",
    hint: "Language \"{language}\" is not available. Supported languages: {supported}.",
    httpStatus: 400,
  },
  OCR_LOW_QUALITY: {
    code: "OCR_LOW_QUALITY",
    message: "Image quality is too low for reliable OCR.",
    hint: "The scanned image resolution is below {minDpi} DPI. Results may be inaccurate. Re-scan at 300+ DPI for best results.",
    httpStatus: 422,
  },
  // E-Sign
  ESIGN_INVALID_EMAIL: {
    code: "ESIGN_INVALID_EMAIL",
    message: "Invalid recipient email address.",
    hint: "The email \"{email}\" is not a valid address. Please check and correct it.",
    httpStatus: 400,
  },
  ESIGN_SELF_SEND: {
    code: "ESIGN_SELF_SEND",
    message: "Cannot send a signature request to yourself.",
    hint: "Use the 'Sign PDF' tool to sign documents yourself. 'Request Signatures' is for sending to others.",
    httpStatus: 400,
  },
  // Redact
  REDACT_NO_MATCHES: {
    code: "REDACT_NO_MATCHES",
    message: "No matches found for the redaction pattern.",
    hint: "The pattern \"{pattern}\" was not found in the document. Check the pattern and try again.",
    httpStatus: 404,
  },
  // Compare
  COMPARE_IDENTICAL: {
    code: "COMPARE_IDENTICAL",
    message: "The two PDFs are identical.",
    hint: "No differences were found between the two documents.",
    httpStatus: 200,
  },
  // Metadata
  METADATA_READ_ONLY: {
    code: "METADATA_READ_ONLY",
    message: "Cannot modify read-only metadata fields.",
    hint: "The field \"{field}\" is read-only in this PDF and cannot be changed.",
    httpStatus: 422,
  },
} as const;

// ─── CLOUD IMPORT Errors (8xxx) ───

export const CLOUD_ERRORS = {
  CLOUD_AUTH_FAILED: {
    code: "CLOUD_AUTH_FAILED",
    message: "Cloud storage authentication failed.",
    hint: "We couldn't connect to your {provider} account. Please re-authorize the connection.",
    httpStatus: 401,
  },
  CLOUD_FILE_NOT_FOUND: {
    code: "CLOUD_FILE_NOT_FOUND",
    message: "The selected file was not found in cloud storage.",
    hint: "The file may have been moved or deleted from {provider}. Please select a different file.",
    httpStatus: 404,
  },
  CLOUD_DOWNLOAD_FAILED: {
    code: "CLOUD_DOWNLOAD_FAILED",
    message: "Failed to download the file from cloud storage.",
    hint: "We couldn't download the file from {provider}. Check your permissions and try again.",
    httpStatus: 502,
  },
  CLOUD_PROVIDER_UNAVAILABLE: {
    code: "CLOUD_PROVIDER_UNAVAILABLE",
    message: "Cloud storage provider is temporarily unavailable.",
    hint: "{provider} appears to be experiencing issues. Try uploading the file directly from your computer instead.",
    httpStatus: 503,
  },
} as const;

// ─── Combined Error Map ───

export const ALL_ERRORS = {
  ...UPLOAD_ERRORS,
  ...PDF_ERRORS,
  ...PROCESS_ERRORS,
  ...LIMIT_ERRORS,
  ...AUTH_ERRORS,
  ...DOWNLOAD_ERRORS,
  ...TOOL_ERRORS,
  ...CLOUD_ERRORS,
} as const;

export type ErrorCode = keyof typeof ALL_ERRORS;

export const ERROR_CATEGORIES = [
  {
    id: "upload",
    label: "Upload Errors",
    description: "Errors related to file upload, validation, and transfer",
    errors: UPLOAD_ERRORS,
  },
  {
    id: "pdf",
    label: "PDF Errors",
    description: "Errors specific to PDF file structure and content",
    errors: PDF_ERRORS,
  },
  {
    id: "process",
    label: "Processing Errors",
    description: "Errors during file processing and job execution",
    errors: PROCESS_ERRORS,
  },
  {
    id: "limit",
    label: "Rate Limit & Quota Errors",
    description: "Errors related to usage limits, credits, and quotas",
    errors: LIMIT_ERRORS,
  },
  {
    id: "auth",
    label: "Authentication & Authorization Errors",
    description: "Errors related to identity, permissions, and plan tiers",
    errors: AUTH_ERRORS,
  },
  {
    id: "download",
    label: "Download Errors",
    description: "Errors related to file download and output retrieval",
    errors: DOWNLOAD_ERRORS,
  },
  {
    id: "tool",
    label: "Tool-Specific Errors",
    description: "Errors specific to individual PDF tools and operations",
    errors: TOOL_ERRORS,
  },
  {
    id: "cloud",
    label: "Cloud Import Errors",
    description: "Errors related to cloud storage import/export",
    errors: CLOUD_ERRORS,
  },
] as const;
