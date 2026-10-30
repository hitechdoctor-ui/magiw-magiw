import { LegalHubView } from "@/components/legal/LegalDocumentView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Νομικές πληροφορίες | MAGIW MAGIW",
  description: "Όροι χρήσης, απόρρητο, cookies, επιστροφές, αποστολές, πληρωμές και στοιχεία επιχείρησης.",
};

export default function LegalHubPage() {
  return <LegalHubView />;
}
