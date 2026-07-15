export const sanitizeRedirectPath = (value: string | null | undefined, fallback = '/') => {
  const target = value?.trim() || '';

  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return fallback;
  }

  return target;
};

export const buildLoginRedirectUrl = (pathname: string, fallback = '/') => {
  const target = sanitizeRedirectPath(pathname, fallback);

  return `/login?redirectTo=${encodeURIComponent(target)}`;
};