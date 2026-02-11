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
                <Sidebar category={category} />
                <div className="main-wrapper col-span-21 relative">
                    <div className="absolute main-header -top-4 left-8 pl-4 pr-4 pt-2 pb-2">
                        <p className="main-header-subtitle text-md">
                            サイトが欲しくなった経緯を教えてください
                        </p>
                    </div>
                    <div className="main-content p-8">
                        {children}
                    </div>
                    <Pagination category={category} section={section ?? ""} />
                </div >
            </main >
        </>
    )
}