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
            <main className="main mx-auto flex w-8/10 gap-12 pt-12 pb-8 justify-center">
                <Sidebar category={category} section={section ?? ""} />
                <div className="main-wrapper relative w-full max-w-4xl">
                    <div className="main-content p-8 pb-4">
                        {children}
                        <Pagination category={category} section={section ?? ""} />
                    </div>
                </div >
            </main >
        </>
    )
}