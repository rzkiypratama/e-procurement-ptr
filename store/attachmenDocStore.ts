import { create } from "zustand";

interface AttachmentDoc {
  id: number;
  namaAttachment: string;
  kategoriAttachment: string;
  fileAttachment: string;
}

interface AttachmentDocState {
  attachmentDoc: AttachmentDoc[];
  addAttachment: (attachmentDoc: AttachmentDoc) => void;
  editAttachment: (attachmentDoc: AttachmentDoc) => void;
  removeAttachment: (id: number) => void;
  initializeAttachment: (attachmentDoc: AttachmentDoc[]) => void;
}

const AttachmentDocStore = create<AttachmentDocState>((set) => ({
    attachmentDoc: [],
    addAttachment: (attachmentDoc) =>
      set((state) => ({
        attachmentDoc: [...state.attachmentDoc, attachmentDoc],
      })),
    editAttachment: (attachmentDoc) =>
      set((state) => ({
        attachmentDoc: state.attachmentDoc.map((item) =>
          item.id === attachmentDoc.id ? attachmentDoc : item,
        ),
      })),
    removeAttachment: (id) =>
      set((state) => ({
        attachmentDoc: state.attachmentDoc.filter((item) => item.id !== id),
      })),
    initializeAttachment: (attachmentDoc) =>
      set(() => ({
        attachmentDoc,
      })),
  }));

  export default AttachmentDocStore;