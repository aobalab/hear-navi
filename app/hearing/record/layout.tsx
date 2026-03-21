import Header from "@/components/header";

export default function RecordLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header category="record" section="" />
            <main className="main mx-auto w-8/10 pt-12">
                <div className="main-wrapper relative">{children}</div>
            </main>
        </>
    );
}