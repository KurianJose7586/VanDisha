import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function WelcomeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary font-bold">
                FA
              </div>
              <h2 className="text-xl font-semibold">Welcome to FRA Atlas</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              A modern geospatial dashboard for Forest Rights Act claims. Upload
              claim PDFs, visualize IFR/CR/CFR layers, overlay vegetation and
              water indices, and get DSS-backed recommendations.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button onClick={onClose}>Get Started</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
