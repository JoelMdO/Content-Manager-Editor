import { ArrowLeft} from 'lucide-react';
import Link from 'next/link';

const BackPageButton: React.FC = () => {
 return (
    <>
    <div className="flex items-center">
        <Link href="/home" className="mr-4">
        <div className="flex items-center text-white hover:text-blue-100">
        <ArrowLeft size={18} className="mr-1" />
        <span>Back to Home</span>
        </div>
        </Link>
    </div>
    </>
 )
}

export default BackPageButton;