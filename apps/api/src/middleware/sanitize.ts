import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'u', 's']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    'img': ['src', 'alt', 'title', 'width', 'height'],
    '*': ['style', 'class']
  },
  allowedIframeHostnames: ['www.youtube.com']
};

export const sanitizeBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], sanitizeOptions);
      }
    }
  }
  next();
};

export const cleanHtmlStr = (html: string) => sanitizeHtml(html, sanitizeOptions);
