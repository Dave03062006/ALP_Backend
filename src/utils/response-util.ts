export function ok(data: any = null) {
  return { success: true, data };
}

export function fail(message: string, details: any = null) {
  return { success: false, message, details };
}
