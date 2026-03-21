import Header from "@/components/header";
import Sidebar from "@/components/side-bar";
import Pagination from "@/components/pagination";

export default async function SectionLayout({
    children, params
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ category: string, section?: string }>
}>) {
    const { category, section } = await params;
    return (
        <>
            <Header category={category} section={section ?? ""} />
            <main className="main grid grid-cols-24 gap-12 pt-12 w-8/10 mx-auto">
                <Sidebar category={category} section={section ?? ""} />
                <div className="main-wrapper col-span-21 relative">
                    {children}
                    <Pagination category={category} section={section ?? ""} />
                </div >
            </main >
        </>
    )
}