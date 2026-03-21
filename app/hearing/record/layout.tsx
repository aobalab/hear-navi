import Header from "@/components/header";
import Sidebar from "@/components/side-bar";

export default function RecordLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header category="record" section="" />
            <main className="main grid grid-cols-24 gap-12 pt-12 w-8/10 mx-auto">
                <Sidebar category="record" />
                <div className="main-wrapper col-span-21 relative">{children}</div>
            </main>
        </>
    );
}