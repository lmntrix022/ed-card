'use client';
import LogoutButton from "@/components/buttons/LogoutButton";
import {faFileLines} from "@fortawesome/free-regular-svg-icons";
import {faArrowLeft, faChartLine, faContactBook} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function AppSidebar() {
  const path = usePathname();
  return (
    <nav className="inline-flex mx-auto flex-col text-center mt-8 gap-2 text-gray-500 font-sans">
      <Link
        href={'/account'}
        className={
          "flex gap-4 p-2 "
          + (path === '/account' ? 'text-pink-600' : '')
        }>
        <FontAwesomeIcon
          fixedWidth={true}
          icon={faFileLines}
          className={'w-6 h-6'}
        />
        <span className="">Ma page</span>
      </Link>
      <Link
        href={'/analytics'}
        className={
          "flex gap-4 p-2 "
          + (path === '/analytics' ? 'text-pink-600' : '')
        }>
        <FontAwesomeIcon
          fixedWidth={true}
          icon={faChartLine}
          className={'w-6 h-6'}
        />
        <span className="">Analyse</span>
      </Link>

      <Link
        href={'/contact'}
        className={
          "flex gap-4 p-2 "
          + (path === '/contact' ? 'text-pink-600' : '')
        }>
        <FontAwesomeIcon
          fixedWidth={true}
          icon={faContactBook}
          className={'w-6 h-6'}
        />
        <span className="">Contact</span>
      </Link>

      <LogoutButton
        iconLeft={true}
        className={'flex gap-4 items-center text-gray-500 p-2'}
        iconClasses={'w-6 h-6'}
      />
      <Link href={'/'} className="flex items-center gap-2 text-xs text-gray-500 border-t pt-4">
        <FontAwesomeIcon icon={faArrowLeft} className={'w-3 h-3'} />
        <span>Retour au site web</span>
      </Link>
    </nav>
  );
}