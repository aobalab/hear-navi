import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function topPage() {
    return (
        <div>
            <h1>トップページ</h1>
            <Link href="./hearing/requirements/self-introduction">
                <Button>
                    ヒアリング開始
                </Button>
            </Link>
        </div>
    );
}