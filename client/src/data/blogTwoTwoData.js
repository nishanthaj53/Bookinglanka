import shape from "../assets/images/shapes/city.png";
import { ARTICLES, articlesIndexMeta } from "./articles";

export const blogTwoInfo = {
  ...articlesIndexMeta,
  shape,
  blogData: ARTICLES.map((article) => ({
    title: article.title,
    image: article.image,
    day: article.day,
    month: article.month,
    author: article.author,
    category: article.category,
    link: `/articles/${article.slug}`,
  })),
};
