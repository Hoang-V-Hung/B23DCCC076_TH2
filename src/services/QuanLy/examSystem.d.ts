declare module ExamSystem {
    export interface Subject {
        tin_chi: string;
        ten_mon: string;
        ma_mon: number;
        khoi_kien_thuc: string[];
    }
  
    export interface Question {
        maCauHoi: string;
        maMonHoc: string;
        noiDung: string;
        mucDo: "Dễ" | "Trung bình" | "Khó" | "Rất khó";
        khoiKienThuc: string;
    }
  
    export interface Exam {
        maDeThi: string;
        maMonHoc: string;
        danhSachCauHoi: Question[];
    }
  }