'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { getAuthInfoFromBrowserCookie } from '@/lib/auth';

// 不需要登录就能打开的路径（与 scripts/edgeone-build.mjs 里的跳过路径保持一致，只取页面部分）
// 注意：'/' 首页不在此列表里，打开首页也需要先登录
const SKIP_PATHS = [
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/manifest.json',
  '/icons/',
  '/logo.png',
  '/screenshot.png',
  '/login',
  '/register',
  '/oidc-register',
  '/warning',
];

// 全站登录门：EdgeOne 上服务端拿不到真实路径，SSR 鉴权守卫拦不住未登录访问，
// 所以在客户端再拦一道。未登录且不在跳过路径里时，跳到登录页，登录完再回来。
export function AuthGate() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // 跳过路径（登录页、静态资源等）不拦截
    if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return;
    // 已登录（cookie 里有认证信息）不拦截
    if (getAuthInfoFromBrowserCookie()) return;
    // 未登录：跳到登录页，登录完再回来
    window.location.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [pathname]);

  return null;
}
