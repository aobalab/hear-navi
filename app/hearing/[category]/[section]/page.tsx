import { Categories } from '../../config';
import ClientPage from './client-page';

export function generateStaticParams() {
    const params: { category: string; section: string }[] = [];

    Object.keys(Categories).forEach(category => {
        Categories[category].sections.forEach(section => {
            params.push({
                category,
                section: section.title
            });
        });
    });

    return params;
}

export default function Page() {
    return <ClientPage />;
}