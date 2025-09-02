export const PRODUCTS_QUERY = `
*[_type=="product"] | order(_createdAt desc)[0...30]{
  _id,
  title,
  "slug": slug.current,
  price,
  mukhi,
  description,
  image,
  "xrayUrl": xray.asset->url
}
`;